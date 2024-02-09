import TeamIcon from "@/components/team/TeamIcon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { MEMBER_COUNT_MAX, MEMBER_COUNT_MIN, MURDER_WEAPON_EMOJIS, PFP_COLOR_CHOICES } from "@/utils/constants";
import { TeamMember } from "@/utils/django_types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye } from "react-icons/fa";
import validator from "validator";
import { z } from "zod";

import { useDjangoContext } from "@/hooks/useDjangoContext";
import { BeatLoader } from "react-spinners";

const editTeamFormSchema = z.object({
  members: z.array(
    z.object({
      name: z.string().optional(),
      email: z.string().optional()
    })
  ),
  in_person: z.boolean(),
  num_brown_members: z.number().optional(),
  phone_number: z.string().optional(),
  classroom_need: z.boolean().optional(),
  where_to_find: z.string().optional(),
  color_choice: z.string(),
  emoji_choice: z.string(),
}).refine(data => {
  if (data.in_person) {
    return (data.phone_number ?? "") !== "" && validator.isMobilePhone(data.phone_number ?? "", "en-US");
  }
  return true;
}, {
  message: "Valid US phone number required.",
  path: ["phone_number"],
}).refine(data => {
  if (data.in_person && data.classroom_need === false) {
    return data.where_to_find !== "";
  }
  return true;
}, {
  message: "Required for in person teams that don't need a room reserved.",
  path: ["where_to_find"],
})

export default function MyTeamPage() {

  const [memberCount, setMemberCount] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [emojiChoice, setEmojiChoice] = useState('');
  const [colorChoice, setColorChoice] = useState('#1e293ba1');

  const [members, setMembers] = useState<TeamMember[]>([{name: "", email: ""}])
  const [membersLoading, setMembersLoading] = useState(true);
  const [membersError, setMembersError] = useState(false);

  const { team } = useAuth();

  const { FetchTeamMembers } = useDjangoContext();
  useEffect(() => {
    setMembersLoading(true);
    FetchTeamMembers().then((members) => {
      setMembers(members);
      setMemberCount(members.length);
      setMembersLoading(false);
    });
  }, [FetchTeamMembers]);

  const form = useForm<z.infer<typeof editTeamFormSchema>>({
    resolver: zodResolver(editTeamFormSchema),
    defaultValues: {
      members: [{ name: "", email: "" }],
      in_person: false,
      num_brown_members: 0,
      classroom_need: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof editTeamFormSchema>) => {
    console.log("vals", values)
    setSubmitting(true);
    await axios.post("/api/update-team", values).then((response) => {
      console.log(response);
       // force refresh
      window.location.reload();
    }
    ).catch((error) => {
      console.error(error);
      // only errors on member based error
      alert("Team members must have valid emails and names. Please update your team roster.")
      setMembersError(true);
    });
    setSubmitting(false);
  };

  const addMemberCount = () => {
    setMemberCount((count) => Math.min(count + 1, MEMBER_COUNT_MAX));
    setMembers((members) => [...members, { name: "", email: "" }]);
  }
  const subtractMemberCount = () => {
    setMemberCount((count) => Math.max(count - 1, MEMBER_COUNT_MIN));
    setMembers((members) => members.slice(0, memberCount - 1));
    // Clear additional member fields
    const clearedMembers = form.getValues("members").slice(0, memberCount - 1);
    form.setValue("members", clearedMembers);
  }

  const [valuesSet, setValuesSet] = useState(false);
  useEffect(() => {
    if (form && team && !valuesSet) {
      const emoji = team?.emoji_choice || "❓"
      const color = team?.color_choice || "#1e293ba1"
      form.setValue("emoji_choice", emoji);
      form.setValue("color_choice", color);
      setEmojiChoice(emoji);
      setColorChoice(color);

      form.setValue("members", members);

      form.setValue("in_person", team?.in_person || false);
      form.setValue("num_brown_members", team?.num_brown_members || 0);
      form.setValue("classroom_need", team?.classroom_need || false);
      form.setValue("phone_number", team?.phone_number || "");
      form.setValue("where_to_find", team?.where_to_find || "");
      setValuesSet(true);
    }
  },[form, team, members, valuesSet])

  return (
    <div className="register-page min-h-[87vh]">
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-white dark">
            <a href={`/team/${team?.id}`} className="dark bg-muted/20 hover:bg-muted/80 btn-gradient-1 flex font-semibold items-center text-center justify-center my-5 mx-[33%] transition-colors duration-300 group">
              <FaEye className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-300"/>
              <p className="px-2 text-slate-400 group-hover:text-white transition-colors duration-300">See page as visible to other teams</p>
              <FaEye className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-300"/>
            </a>
            {/* center div */}
            <div className="team-icon dark justify-center items-center flex">
              <Dialog>
                <DialogTrigger>
                  <TeamIcon className="w-24 h-24 mx-auto text-center" color={colorChoice} emoji={emojiChoice} emoji_cn="text-6xl" hover_effect={true}/>
                </DialogTrigger>
                <DialogContent className="dark text-white">
                  <DialogHeader>
                    <DialogTitle>Update Team Icon</DialogTitle>
                    <DialogDescription>
                    <div className="flex">
                      <div className="flex-grow additional-form pt-5 ml-5 space-y-4">
                        <FormField control={form.control} name="emoji_choice" render={({ field }) => (
                          <FormItem>
                          <FormLabel>Favorite Murder Weapon</FormLabel>
                            <Select onValueChange={(value) => {
                              field.onChange(value);
                              setEmojiChoice(value);
                            }} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue className="text-slate-400" placeholder="Choose your weapon" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="dark">
                                {MURDER_WEAPON_EMOJIS.map((emoji) => {
                                  return (<SelectItem value={emoji} className="text-xl">{emoji}</SelectItem>)
                                })}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-right"/>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="color_choice" render={({ field }) => (
                          <FormItem>
                          <FormLabel>Favorite Color</FormLabel>
                            <Select onValueChange={(value) => {
                              field.onChange(value);
                              setColorChoice(value);
                            }} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue className="text-slate-400" placeholder="Choose your color" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="dark">
                                {PFP_COLOR_CHOICES.map((color) => {
                                  return (<SelectItem value={color} className="text-xl">
                                    <div className="w-10 h-10 border-2 border-slate-800 rounded" style={{backgroundColor: color}}></div>
                                  </SelectItem>)
                                })}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-right"/>
                          </FormItem>
                        )} />
                      </div>
                    </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            <h1 className="text-4xl font-bold text-center">{team?.team_name}</h1>
            <div className="flex justify-center items-center">
              {form.formState.isDirty ? (!submitting ? <Button type="submit">Submit Changes</Button> : <Button type="submit" disabled>Submitting...</Button>) : null }
            </div>
            <section className="team-members text-center dark bg-gradient-to-b from-muted/50 to-muted/80 px-6 py-4 no-underline outline-none focus:shadow-md btn-gradient-1 relative mx-[5%] md:mx-[30%]">
              {membersLoading ? <BeatLoader className="justify-center content-center pr-2" color={'#fff'} size={12} />  :
              <div className="members-info">
                <h1 className="text-center font-bold text-xl">{memberCount} Member{memberCount !== 1 ? 's' : ''}</h1>
                <div className="justify-center items-center flex">
                  <Dialog>
                    <DialogTrigger><a className={`text-center justify-center align-center underline ${membersError ? 'text-[#d66464]' : 'text-slate-400'}`} onClick={() => setMembersError(false)}>⚙️ edit team roster ⚙️</a></DialogTrigger>
                    <DialogContent className="dark text-white">
                      <DialogHeader>
                        <DialogTitle>Update Team Roster</DialogTitle>
                        <DialogDescription>
                        <div className="max-h-[60vh] overflow-y-auto pt-6">
                          <FormField control={form.control} name="members" render={() => (
                            <FormItem>
                              <div className="space-y-4">
                                  {[...Array(memberCount)].map((_, index) => (
                                  <div key={index} className="space-y-4">
                                    <FormField control={form.control} name={`members.${index}.name`} render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Member {index+1} Name</FormLabel>
                                        <FormControl>
                                          <Input type="text" placeholder="Enter member name" {...field}
                                            onChange={(e) => {
                                              field.onChange(e.target.value)
                                              const newMembers = [...members];
                                              newMembers[index] = {
                                                ...newMembers[index],
                                                name: e.target.value,
                                                email: newMembers[index].email
                                              };
                                              setMembers(newMembers);
                                            }}
                                          />
                                        </FormControl>
                                        <FormMessage className="text-right"/>
                                      </FormItem>
                                    )} />
                                    <FormField control={form.control} name={`members.${index}.email`} render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Member {index+1} Email</FormLabel>
                                        <FormControl>
                                          <Input type="email" placeholder="Enter member email" {...field} 
                                          onChange={(e) => {
                                            field.onChange(e.target.value)
                                            const newMembers = [...members];
                                            newMembers[index] = {
                                              ...newMembers[index],
                                              name: newMembers[index].name,
                                              email: e.target.value
                                            };
                                            setMembers(newMembers);
                                          }}/>
                                        </FormControl>
                                        <FormMessage className="text-right"/>
                                      </FormItem>
                                    )} />
                                  </div>
                                ))}
                                {memberCount < MEMBER_COUNT_MAX ? <Button className="bg-transparent font-bold text-white hover:text-black" type="button" onClick={() => addMemberCount()}>+</Button> : null}
                                {memberCount > MEMBER_COUNT_MIN ? <Button className="bg-transparent font-bold text-white hover:text-black" type="button" onClick={() => subtractMemberCount()}>-</Button> : null}
                              </div>
                            </FormItem>
                          )} />
                        </div>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="members pt-6 flex justify-center items-center space-x-2">
                  {members.map((member, index) => (
                    <p id={index.toString()}>{member.name}
                      {index < memberCount - 1 ? ',' : ''}
                    </p>
                  ))}
                </div>
              </div>
              }
          </section>
          {/* On Campus Participation Section */}
          <section className="on-campus mx-[30%]">
            <FormField control={form.control} name="in_person" render={({ field }) => (
              <div>
                <div className="pb-5">
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>In Person Participation</FormLabel>
                      <FormDescription>
                        Are you planning on participating in the hunt on Brown University's campus?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                </div>
                {/* IN_PERSON ONLY FIELDS */}
                {field.value && (
                  <div className="in-person-fields border-l-4 border-slate-800 space-y-6 pl-10 ml-5">
                  <FormField control={form.control} name="num_brown_members" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Brown/RISD Community Team Members</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} max={MEMBER_COUNT_MAX} {...field} onChange={event => field.onChange(+event.target.value)}/>
                      </FormControl>
                      <FormDescription>
                        (Undergraduates, Graduates, Faculty, or Alumni)
                      </FormDescription>
                      <FormMessage className="text-right"/>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phone_number" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Best Phone Number to Contact</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormDescription>
                        Required for all on-site teams. This will be our primary communication method with you.
                      </FormDescription>
                      <FormMessage className="text-right"/>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="classroom_need" render={({ field }) => (
                    <div>
                      <div className="pb-5">
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Room Space Needed</FormLabel>
                            <FormDescription>
                              Do you need us to provide room space for you on campus?
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      </div>
                    {!field.value && (
                      <FormField control={form.control} name="where_to_find" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Where can we best find you while you're solving puzzles?</FormLabel>
                              <FormControl>
                                <Input type="text" {...field} />
                              </FormControl>
                              <FormDescription>
                                (e.g: Hegeman Common Room, Barus and Holley Room ###, Zoom, Discord, etc.)
                              </FormDescription>
                              <FormMessage className="text-right"/>
                            </FormItem>
                        )} />
                    )}
                  </div>
                  )} />
                </div>
                )}
            </div>
            )} />
          </section>
          </form>
        </Form>
      </div>
    </div>
  );
}
