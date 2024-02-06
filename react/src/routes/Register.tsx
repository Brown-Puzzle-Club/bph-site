import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import validator from "validator";
import { z } from "zod";


const formSchema = z.object({
  teamUsername: z.string().min(2, {
    message: "Team username must be at least 2 characters.",
  }),
  teamName: z.string().min(1, {
    message: "Team name is required.",
  }),
  teamPassword: z.string().min(6, {
    message: "Team password must be at least 6 characters.",
  }),
  retypePassword: z.string(),
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
  inPerson: z.boolean(),
  numCommunityMembers: z.number().optional(),
  phoneNumber: z.string().optional(),
  needRoomSpace: z.boolean().optional(),
  whereToFind: z.string().optional(),
  colorChoice: z.string().optional(),
  emojiChoice: z.string().optional(),
}).refine(data => {
  return data.teamPassword === data.retypePassword;
}, {
  message: "Passwords do not match.",
  path: ["retypePassword"],
}).refine(data => {
  if (data.inPerson) {
    return (data.phoneNumber ?? "") !== "" && validator.isMobilePhone(data.phoneNumber ?? "", "en-US");
  }
  return true;
}, {
  message: "Valid US phone number required.",
  path: ["phoneNumber"],
}).refine(data => {
  if (data.inPerson && data.needRoomSpace === false) {
    return data.whereToFind !== "";
  }
  return true;
}, {
  message: "Required for in person teams that don't need a room reserved.",
  path: ["whereToFind"],
});

export default function RegisterForm() {
  const [memberCount, setMemberCount] = useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamUsername: "",
      teamName: "",
      teamPassword: "",
      retypePassword: "",
      members: [{ name: "", email: "" }],
      inPerson: false,
      numCommunityMembers: 0,
      phoneNumber: "",
      needRoomSpace: false,
      whereToFind: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    // Send data to API endpoint
    toast({
      title: "Form submitted successfully",
      duration: 5000,
    });
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
    <div className="mx-[20%] lg:mx-[30%]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-white dark">
          <h1 className="text-center font-bold text-3xl pt-4">Registration</h1>
          <section className="user-info border-b-4 border-slate-800 space-y-4 pb-8">
            <FormField control={form.control} name="teamUsername" render={({ field }) => (
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
            <FormField control={form.control} name="teamName" render={({ field }) => (
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
            <FormField control={form.control} name="teamPassword" render={({ field }) => (
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
            <FormField control={form.control} name="retypePassword" render={({ field }) => (
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
        <section className="on-campus space-y-4">
          <h1 className="text-center font-bold text-xl">On Campus</h1>
          <FormField control={form.control} name="inPerson" render={({ field }) => (
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
                <FormField control={form.control} name="numCommunityMembers" render={({ field }) => (
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
                <FormField control={form.control} name="phoneNumber" render={({ field }) => (
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
                <FormField control={form.control} name="needRoomSpace" render={({ field }) => (
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
                    <FormField control={form.control} name="whereToFind" render={({ field }) => (
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
