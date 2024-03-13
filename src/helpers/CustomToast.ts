import { Toast } from "react-native-toast-notifications";
export const CustomErrorToast = (err: any) => {
  Toast.show(err, { duration: 2000, type: "danger" });
};
export const CustomInfoToast = (err: any) => {
  Toast.show(err, { duration: 2000, type: "warning" });
};
