import Container from "./components/Container";
import ListingCard from "./components/listings/ListingCard";
import EmptyState from "./components/EmptyState";
import ClientOnly from "./components/clientOnly";
import { GetServerSidePropsContext } from "next";
import getListings, {
  IListingsParams,
} from "./actions/getListings";
import getCurrentUser from "./actions/getCurrentUser";

interface HomeProps {
  searchParams: IListingsParams;
}

const Home = async ({ searchParams }: HomeProps) => {
  const listings = await getListings(searchParams);
  const currentUser = await getCurrentUser();

  if (!listings || listings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <Container>
        <div
          className="
          mt-20
          pt-24
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-8
        "
        >
          {listings.map((listing: any) => (
            <ListingCard
              key={listing.id}
              data={listing}
              currentUser={currentUser}
            />
          ))}
        </div>
      </Container>
    </ClientOnly>
  );
};
export async function getServerSideProps(
  context: GetServerSidePropsContext
) {
  if (!context.params) {
    // Return some default props in case params is undefined
    return { props: {} };
  }

  const userId = Array.isArray(context.params.userId)
    ? context.params.userId[0]
    : context.params.userId; // This gets the userId from the route

  // Check if userId is defined before calling getListings
  if (!userId) {
    // Handle the case when userId is undefined
    // For example, return an error message or some default props
    return { props: {} };
  }

  const listings = await getListings({ userId });
  const currentUser = await getCurrentUser();

  return { props: { listings, currentUser } };
}

export default Home;
