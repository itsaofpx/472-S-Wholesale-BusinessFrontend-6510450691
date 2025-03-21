function ErrorText({ message }: { message: string }) {
  return message ? (
    <div className="text-left">
      <p className="text-red-500 text-sm m-0">{message}</p>{" "}
    </div>
  ) : null;
}
export default ErrorText;
