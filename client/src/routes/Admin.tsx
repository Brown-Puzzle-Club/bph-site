import { Button } from "@/components/ui/button";
import { Round } from "@/utils/django_types";
import axios from "axios";
import { useEffect, useState } from "react";

export default function AdminPanel() {
  const [cases, setCases] = useState<Round[]>([]);
  const [selectedRound, setSelectedRound] = useState<Round | null>(null); // To track the selected round for the modal

  useEffect(() => {
    axios.get("/api/rounds").then((response) => {
      setCases(response.data);
    });
  }, []);

  const openModal = (round: Round) => {
    setSelectedRound(round);
  };

  const giveToTestSolver = (round: Round) => {
    // Implement your API call to give the round to testsolver
    console.log(`Give round ${round.name} to testsolver.`);
    axios.post(`/api/unlock-case/${round.slug}`).then((response) => {
      console.log(response);
    });
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      <table>
        <thead>
          <tr>
            <th>Round Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((round) => (
            <tr key={round.id}>
              <td>{round.name}</td>
              <td>
                <Button onClick={() => openModal(round)}>Info</Button>
                <Button onClick={() => giveToTestSolver(round)}>Give to TestSolver</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedRound && (
        <div>
          <span className="font-bold">desc for {selectedRound.name}:</span>
          <div>{selectedRound.description}</div>
        </div>
      )}
    </div>
  );
}
