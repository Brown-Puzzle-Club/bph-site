import { useState } from 'react';

export default function Register() {
  const [teamUsername, setTeamUsername] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamPassword, setTeamPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [members, setMembers] = useState([{ name: '', email: '' }]);
  const [inPerson, setInPerson] = useState(false);
  const [numCommunityMembers, setNumCommunityMembers] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [needRoomSpace, setNeedRoomSpace] = useState('');
  const [whereToFind, setWhereToFind] = useState('');

  const addMember = () => {
    setMembers([...members, { name: '', email: '' }]);
  };

  const removeMember = (index: number) => {
    const newMembers = [...members];
    newMembers.splice(index, 1);
    setMembers(newMembers);
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    // Handle form submission to /api/register
    const formData = {
      teamUsername,
      teamName,
      teamPassword,
      members,
      inPerson,
      numCommunityMembers,
      phoneNumber,
      needRoomSpace,
      whereToFind
    };
    console.log(formData);
    // Submit formData to your API endpoint
  };

  return (
    <div className="register bg-slate-900 text-white h-[90vh] overscroll-contain overflow-hidden overflow-y-auto">
      <h1 className="text-4xl font-bold text-center py-5">Register</h1>
      <form onSubmit={handleSubmit} className="register-content text-center dark bg-gradient-to-b from-muted/50 to-muted/80 p-6 no-underline outline-none focus:shadow-md btn-gradient-1 relative mx-[5%] md:mx-[20%]">
        <div className="register-box btn-gradient-bot pb-5">
          {/* Team Info Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">Team Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="teamUsername" className="block mb-1">Team Username *</label>
                <input type="text" id="teamUsername" className="input-field" value={teamUsername} onChange={(e) => setTeamUsername(e.target.value)} required />
                <p className="text-sm text-left">This is the private username your team will use when logging in. It should be short and not contain special characters.</p>
              </div>
              <div>
                <label htmlFor="teamName" className="block mb-1">Team Name *</label>
                <input type="text" id="teamName" className="input-field" value={teamName} onChange={(e) => setTeamName(e.target.value)} required />
                <p className="text-sm text-left">This is how your team name will appear on the public leaderboard.</p>
              </div>
              <div>
                <label htmlFor="teamPassword" className="block mb-1">Team Password *</label>
                <input type="password" id="teamPassword" className="input-field" value={teamPassword} onChange={(e) => setTeamPassword(e.target.value)} required />
                <p className="text-sm text-left">You’ll probably share this with your team.</p>
              </div>
              <div>
                <label htmlFor="retypePassword" className="block mb-1">Retype Password *</label>
                <input type="password" id="retypePassword" className="input-field" value={retypePassword} onChange={(e) => setRetypePassword(e.target.value)} required />
                <p className="text-sm text-left">Validation: matches 'Team password'</p>
              </div>
            </div>
          </div>
          {/* Team Members Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">Team Members</h2>
            {members.map((member, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`memberName${index}`} className="block mb-1">Member Name *</label>
                  <input type="text" id={`memberName${index}`} className="input-field" value={member.name} onChange={(e) => {
                    const newMembers = [...members];
                    newMembers[index].name = e.target.value;
                    setMembers(newMembers);
                  }} required />
                </div>
                <div>
                  <label htmlFor={`memberEmail${index}`} className="block mb-1">Member Email *</label>
                  <input type="email" id={`memberEmail${index}`} className="input-field" value={member.email} onChange={(e) => {
                    const newMembers = [...members];
                    newMembers[index].email = e.target.value;
                    setMembers(newMembers);
                  }} required />
                  <p className="text-sm text-left">Validation: email address</p>
                </div>
                {index > 0 && (
                  <button type="button" onClick={() => removeMember(index)} className="text-red-500 font-bold mt-2">Remove</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addMember} className="btn-gradient-bot mt-3">Add Member</button>
          </div>
          {/* On Campus Participation Section */}
          <div>
            <h2 className="text-xl font-bold mb-3">On Campus Participation</h2>
            <div className="mb-4">
              <label className="block mb-2">
                <input type="checkbox" className="mr-2" checked={inPerson} onChange={(e) => setInPerson(e.target.checked)} />
                In Person
              </label>
              {inPerson && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="numCommunityMembers" className="block mb-1">How many Brown/RISD community members on your team? *</label>
                    <input type="number" id="numCommunityMembers" className="input-field" value={numCommunityMembers} onChange={(e) => setNumCommunityMembers(e.target.value)} required />
                  </div>
                  <div>
                    <label htmlFor="phoneNumber" className="block mb-1">Best phone number to contact *</label>
                    <input type="tel" id="phoneNumber" className="input-field" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                    <p className="text-sm text-left">Validation: valid phone number</p>
                  </div>
                  <div>
                    <label className="block mb-1">Do you need us to provide room space for you on campus? *</label>
                    <div className="flex items-center">
                      <input type="radio" id="roomSpaceYes" name="needRoomSpace" className="mr-2" value="yes" checked={needRoomSpace === 'yes'} onChange={() => setNeedRoomSpace('yes')} required />
                      <label htmlFor="roomSpaceYes" className="mr-4">Yes</label>
                      <input type="radio" id="roomSpaceNo" name="needRoomSpace" className="mr-2" value="no" checked={needRoomSpace === 'no'} onChange={() => setNeedRoomSpace('no')} required />
                      <label htmlFor="roomSpaceNo">No</label>
                    </div>
                  </div>
                  {needRoomSpace === 'no' && (
                    <div>
                      <label htmlFor="whereToFind" className="block mb-1">Where can we best find you while you're solving puzzles? *</label>
                      <input type="text" id="whereToFind" className="input-field" value={whereToFind} onChange={(e) => setWhereToFind(e.target.value)} required />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Submit Button */}
          <button type="submit" className="btn-gradient-top">Submit</button>
        </div>
      </form>
    </div>
  );
}
