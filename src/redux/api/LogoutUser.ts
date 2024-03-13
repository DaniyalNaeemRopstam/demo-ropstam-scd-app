import { WEB_SOCKET_URL_FROM_ENV } from "@env";
import { useWebsocket } from "../../hooks/useWebsocket";
import { useDispatch } from "react-redux";
import { deleteToken } from "../features/AuthSlice";

export default function LogoutUser() {
  const dispatch = useDispatch();
  const { socket } = useWebsocket(WEB_SOCKET_URL_FROM_ENV);
  socket?.close();

  dispatch(deleteToken());
}
