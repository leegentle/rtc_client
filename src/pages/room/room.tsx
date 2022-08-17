import React, {
  FC,
  useMemo,
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
} from "react";
import { useMatch } from "react-router-dom";
import "./room.scss";
import socketIOClient from "socket.io-client";

interface msgType {
  name: string;
  value: string;
}

const App: FC = () => {
  const {
    params: { room: roomName },
  } = useMatch("/room/:room")!;
  let myPeerCon: any;
  const socket = useMemo(
    () =>
      socketIOClient("localhost:4002", {
        transports: ["websocket"],
      }),
    []
  );

  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [msgList, setMsgList] = useState<msgType[]>([]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("msg", { name: name, message: value }, roomName);
  };

  const socketEvent = () => {
    socket.emit("join_room", roomName);

    socket.on("welcome", async () => {
      console.log("웰컴");
      const offer = await myPeerCon.createOffer();
      console.log(offer);
      myPeerCon.setLocalDescription(offer);
      socket.emit("offer", offer, roomName);
    });

    socket.on("offer", async (offer) => {
      myPeerCon.setRemoteDescription(offer);
      const answer = await myPeerCon.createAnswer();
      myPeerCon.setLocalDescription(answer);
      socket.emit("answer", answer, roomName);
    });

    socket.on("answer", (answer) => {
      myPeerCon.setRemoteDescription(answer);
    });

    socket.on("ice", (ice) => {
      myPeerCon.addIceCandidate(ice);
      console.log("얼음 받았다");
    });
    socket.on("msg", (msg: string) => {
      console.log(msg);
    });
  };
  const handleIce = (data: any) => {
    socket.emit("ice", data.candidate, roomName);
    console.log("얼음보냈다");
  };

  const handleAddStream = (data: any) => {
    console.log("애드스트림");
    console.log(data.stream);
  };

  const makeConnection = () => {
    myPeerCon = new RTCPeerConnection();
    myPeerCon.addEventListener("icecandidate", handleIce);
    myPeerCon.addEventListener("addstream", handleAddStream);
  };

  useEffect(() => {
    socketEvent();
    makeConnection();
  }, []);

  return (
    <div className="App">
      <form
        className="chat-form"
        onSubmit={(e: FormEvent<HTMLFormElement>) => submit(e)}
      >
        <div className="chat-inputs">
          <input
            type="text"
            autoComplete="off"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            value={name}
            placeholder="유저이름"
          />
          <input
            type="text"
            autoComplete="off"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setValue(e.target.value)
            }
            value={value}
            placeholder="메세지입력하기"
          />
        </div>
        <button type="submit">입력하기</button>
      </form>
    </div>
  );
};

export default App;
