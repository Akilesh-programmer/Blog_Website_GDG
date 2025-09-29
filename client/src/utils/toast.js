import toast from "react-hot-toast";

export const notifySuccess = (msg, opts = {}) => toast.success(msg, opts);
export const notifyError = (msg, opts = {}) => toast.error(msg, opts);
export const notifyInfo = (msg, opts = {}) =>
  toast(msg, { icon: "💡", ...opts });
