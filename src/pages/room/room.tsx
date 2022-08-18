import React, {
  FC,
  useMemo,
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
} from "react";
import { useMatch, useLocation } from "react-router-dom";
import "./room.scss";
import socketIOClient from "socket.io-client";
import Button from "antd/lib/button";
import Input from "antd/lib/input";

interface msgType {
  name: string;
  value: string;
}

interface Users {
  socketid: string;
  nick: string;
}

const App: FC = () => {
  const {
    params: { room: roomName },
  } = useMatch("/room/:room")!;
  const { state }: { state: any } = useLocation()!;
  let cons: { [socketId: string]: RTCPeerConnection } = {};
  const socket = useMemo(
    () =>
      socketIOClient("localhost:4002", {
        transports: ["websocket"],
      }),
    []
  );

  const [value, setValue] = useState("");
  const [msgList, setMsgList] = useState<msgType[]>([]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(value);
    socket.emit("msg", { name: state.nick, message: value }, roomName);
  };

  const socketEvent = () => {
    socket.emit("join_room", { roomName: roomName, nick: state.nick });

    socket.on("otherUsers", (users: Users[]) => {
      console.log("dd");
      console.log(users);

      users.forEach(async (user) => {
        const { socketid } = user;
        const con = new RTCPeerConnection();
        const offer = await con.createOffer();
        con.setLocalDescription(offer);
        cons[socketid] = con;

        const data = {
          offer,
          sendID: socket.id,
          receiveID: socketid,
        };
        socket.emit("offer", data);
      });
    });

    // socket.on("welcome", async () => {
    //   console.log("웰컴");

    //   const offer = await myPeerCon.createOffer();
    //   myPeerCon.setLocalDescription(offer);
    //   socket.emit("offer", offer, roomName);
    // });

    // socket.on("offer", async (offer) => {
    //   myPeerCon.setRemoteDescription(offer);
    //   const answer = await myPeerCon.createAnswer();
    //   myPeerCon.setLocalDescription(answer);
    //   socket.emit("answer", answer, roomName);
    // });

    // socket.on("answer", (answer) => {
    //   myPeerCon.setRemoteDescription(answer);
    // });

    // socket.on("ice", (ice) => {
    //   myPeerCon.addIceCandidate(ice);
    //   console.log("얼음 받았다");
    // });
    // socket.on("msg", (msg: any) => {
    //   console.log(msg);
    // });
  };
  const handleIce = (data: any) => {
    socket.emit("ice", data.candidate, roomName);
    console.log("얼음보냈다");
  };

  const handleAddStream = (data: any) => {
    console.log("애드스트림");
    console.log(data.stream);
  };

  // const makeConnection = () => {
  //   myPeerCon = new RTCPeerConnection();
  //   myPeerCon.addEventListener("icecandidate", handleIce);
  //   myPeerCon.addEventListener("addstream", handleAddStream);
  // };

  useEffect(() => {
    socketEvent();
    // makeConnection();
    console.log(state);
  }, []);

  return (
    <div className="App">
      <form
        className="chat-form"
        onSubmit={(e: FormEvent<HTMLFormElement>) => submit(e)}
      >
        <div className="chat-inputs">
          <Input
            type="text"
            autoComplete="off"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setValue(e.target.value)
            }
            value={value}
            placeholder="메세지입력하기"
          />
        </div>
        <Button type="primary" htmlType="submit">
          입력하기
        </Button>
      </form>
    </div>
  );
};

export default App;
