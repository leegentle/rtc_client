import React, { FC, useState, useEffect, ChangeEvent, FormEvent } from "react";
import Button from "antd/lib/button";
import Input from "antd/lib/input";
import { useNavigate } from "react-router-dom";

import "./App.css";

const App: FC = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const goToRoom = () => {
    if (value === "") {
      alert("방 이름을 입력해주세요");
      return;
    }
    navigate(`/room/${value}`);
  };

  useEffect(() => {}, []);

  return (
    <div id="Index">
      <form
        className="Index_form"
        onSubmit={(e: FormEvent<HTMLFormElement>) => submit(e)}
      >
        <Input
          className="Index_form_input"
          value={value || ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue(e.target.value)
          }
          type="text"
        />
        <Button
          onClick={goToRoom}
          className="Index_form_button"
          htmlType="submit"
        >
          방 입장
        </Button>
      </form>
    </div>
  );
};

export default App;
