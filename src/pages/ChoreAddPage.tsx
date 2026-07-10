// pages/ChoreAddPage.tsx
import { useState } from "react";
import { TextBox } from "../components/chore/TextBox";

export default function ChoreAddPage() {
  const [name, setName] = useState("");
  const [nameTouched, setNameTouched] = useState(false);

  const nameError =
    nameTouched && name.trim() === "" ? "제목을 입력해 주세요." : undefined;

  return (
    <div className="min-h-screen bg-white px-5 py-4">
      <TextBox
        label="제목"
        value={name}
        onChange={setName}
        onBlur={() => setNameTouched(true)}
        placeholder="집안일 이름을 입력해 주세요"
        error={nameError}
      />
    </div>
  );
}
