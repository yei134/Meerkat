import { Form, useLoaderData } from "react-router-dom";
import { getDataset } from "./pages/datasetinfo";

export async function loader({ params }) {
  const dataset = await getDataset(params.dataset);
  return { dataset };
}
export default function Dataset() {
  const { dataset } = useLoaderData();
  // existing code
}