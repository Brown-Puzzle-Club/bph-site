import TeamIcon from "@/components/team/TeamIcon";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { MURDER_WEAPON_EMOJIS, PFP_COLOR_CHOICES } from "@/utils/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import validator from "validator";
import { z } from "zod";


export const registerFormSchema = z.object({
  team_id: z.string().min(2, {
    message: "Team username must be at least 2 characters.",
  }),
  team_name: z.string().min(1, {
    message: "Team name is required.",
  }),
  password: z.string().min(6, {
    message: "Team password must be at least 6 characters.",
  }),
  retype_password: z.string(),
  members: z.array(
    z.object({
      name: z.string().min(1, {
        message: "Member name is required.",
      }),
      email: z.string().email({
        message: "Invalid email address.",
      }),
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
  return data.password === data.retype_password;
}, {
  message: "Passwords do not match.",
  path: ["retype_password"],
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
});

export default function RegisterForm() {
  const [memberCount, setMemberCount] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [emojiChoice, setEmojiChoice] = useState('❓');
  const [colorChoice, setColorChoice] = useState('#1e293ba1');

  const { register, team } = useAuth();
  console.log(team)

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      team_id: "",
      team_name: "",
      password: "",
      retype_password: "",
      members: [{ name: "", email: "" }],
      in_person: false,
      num_brown_members: 0,
      classroom_need: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof registerFormSchema>) => {
    setSubmitting(true);
    await register(values);
    setSubmitting(false);
  };

  const [MEMBER_COUNT_MIN, MEMBER_COUNT_MAX] = [1, 12];
  const addMemberCount = () => {
    setMemberCount((count) => Math.min(count + 1, MEMBER_COUNT_MAX));
  }
  const subtractMemberCount = () => {
    setMemberCount((count) => Math.max(count - 1, MEMBER_COUNT_MIN));
    // Clear additional member fields
    const clearedMembers = form.getValues("members").slice(0, memberCount - 1);
    form.setValue("members", clearedMembers);
  }

  return (
    <div className="register-page">
      {team ? <h1 className="dark text-right pr-10 text-slate-400 fixed right-0 text-sm"><b>NOTE</b>: You are already registered ☝️</h1> : null}
      <div className="mx-[20%] lg:mx-[30%]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-white dark">
            <h1 className="text-center font-bold text-3xl pt-4">Registration</h1>
            <section className="user-info border-b-4 border-slate-800 space-y-4 pb-8">
              <FormField control={form.control} name="team_id" render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Username</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter team username" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the private username your team will use when logging in. It should be short and not contain special characters.
                  </FormDescription>
                  <FormMessage className="text-right"/>
                </FormItem>
              )} />
              <FormField control={form.control} name="team_name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter team name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is how your team name will appear on the public leaderboard.
                  </FormDescription>
                  <FormMessage className="text-right"/>
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter team password" {...field} />
                  </FormControl>
                  <FormDescription>
                    You'll probably share this with your team.
                  </FormDescription>
                  <FormMessage className="text-right"/>
                </FormItem>
              )} />
              <FormField control={form.control} name="retype_password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Retype Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Retype team password" {...field} />
                  </FormControl>
                  <FormMessage className="text-right"/>
                </FormItem>
              )} />
            </section>
            {/* Members Section */}
            <section className="team-members border-b-4 border-slate-800 space-y-4 pb-8">
              <h1 className="text-center font-bold text-xl">Team Members</h1>
              <h4 className="text-center text-slate-400 text-sm"><b>We recommend teams to be around 7 to 10 people</b>. The maximum team size is 12 people, but there's no minimum team size—you can still have fun with a team of 2!</h4>
              <FormField control={form.control} name="members" render={() => (
                <FormItem>
                  <div className="space-y-4">
                      {[...Array(memberCount)].map((_, index) => (
                      <div key={index} className="space-y-4">
                        <FormField control={form.control} name={`members.${index}.name`} render={({ field }) => (
                          <FormItem>
                            <FormLabel>Member {index+1} Name</FormLabel>
                            <FormControl>
                              <Input type="text" placeholder="Enter member name" {...field} />
                            </FormControl>
                            <FormMessage className="text-right"/>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name={`members.${index}.email`} render={({ field }) => (
                          <FormItem>
                            <FormLabel>Member {index+1} Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter member email" {...field} />
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
          </section>
          {/* On Campus Participation Section */}
          <section className="on-campus space-y-4 border-b-4 border-slate-800 pb-8">
            <h1 className="text-center font-bold text-xl">On Campus</h1>
            <FormField control={form.control} name="in_person" render={({ field }) => (
              <div>
                <div className="pb-5">
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>In Person Participation</FormLabel>
                      <FormDescription>
                        Are you planning on participating in the hunt on Brown University Campus?
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
                      <FormLabel>Number of Brown Community Team Members</FormLabel>
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
          <section className="additional-questions">
            <h1 className="text-center font-bold text-xl pb-4">Detective Orientation</h1>
            <div className="flex">
              <div className="flex flex-shrink-0 w-20 h-20 justify-center items-center">
                <TeamIcon emoji={emojiChoice} color={colorChoice} emoji_cn="text-5xl"/>
              </div>
              <div className="flex-grow additional-form border-l-4 border-slate-800 pl-10 ml-5 space-y-4">
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
                            {/* square div with color as the background color */}
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

          </section>
            { !submitting ? <Button type="submit">Submit</Button> : <Button type="submit" disabled>Submitting...</Button> }
          </form>
        </Form>
      </div>
    </div>
  );
}
