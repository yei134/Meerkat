import { getDataset } from "./pages/datasetinfo";

export async function loader({ params }) {
  const dataset = await getDataset(params.datasetId);
  return { dataset };
}
export default function Contact() {
  const { dataset } = useLoaderData();
  // existing code
}

//先省略這頁