import { useMediaQuery } from "@mantine/hooks";

const TestPage = () => {
  const match = useMediaQuery("(min-width:500px)");

  return (
    <h1>
      {match ? "width is more than 500px" : "Width is not more than 500px"}
    </h1>
  );
};

export default TestPage;
