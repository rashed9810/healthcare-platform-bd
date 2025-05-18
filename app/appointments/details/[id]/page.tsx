import ClientEntry from "./client-entry";

export default function AppointmentDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return <ClientEntry id={params.id} />;
}
