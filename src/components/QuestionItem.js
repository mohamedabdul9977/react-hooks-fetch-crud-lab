import React, { useEffect, useState } from "react";

function QuestionItem({ question, onDelete, onUpdate }) {
  const { id, prompt, answers } = question;
  const [selectedIndex, setSelectedIndex] = useState(question.correctIndex);

  // Sync local state with props when question updates
  useEffect(() => {
    setSelectedIndex(question.correctIndex);
  }, [question.correctIndex]);

  function handleDeleteClick() {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE",
    }).then(() => onDelete(id));
  }

  function handleCorrectAnswerChange(event) {
    const newCorrectIndex = parseInt(event.target.value);
    setSelectedIndex(newCorrectIndex); // Immediately update UI

    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correctIndex: newCorrectIndex }),
    })
      .then((res) => res.json())
      .then((updatedQuestion) => onUpdate(updatedQuestion));
  }

  const options = answers.map((answer, index) => (
    <option key={index} value={index}>
      {answer}
    </option>
  ));

  return (
    <li>
      <h4>Question {id}</h4>
      <h5>Prompt: {prompt}</h5>
      <label>
        Correct Answer:
        <select value={selectedIndex} onChange={handleCorrectAnswerChange}>
          {options}
        </select>
      </label>
      <button onClick={handleDeleteClick}>Delete Question</button>
    </li>
  );
}

export default QuestionItem;