import { Loader, Text } from "@mantine/core";

export function Loading() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(4px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        gap: "2rem", 
        padding: "0 1rem",
      }}
    >
      <Text size={'40'} fw={700} c="dimmed" style={{ lineHeight: 1 }}>
        Fuck this shit . . .
      </Text>
      <Loader size={50} color="indigo" />
    </div>
  );
}
