import { Loader } from "@mantine/core";

export default function Loading() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
        <div><h1>Fuck this shit . . . </h1>
        <Loader size={48} color="indigo" /></div>
    </div>
  );
}
