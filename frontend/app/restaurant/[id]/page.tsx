import { RestaurantDetails } from "@/components/restaurant-details"

async function getRestaurant(id: string) {
  const res = await fetch(`http://localhost:8000/analyze/${id}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch restaurant data")
  }

  return res.json()
}

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const restaurant = await getRestaurant(id)

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <RestaurantDetails restaurant={restaurant} />
    </main>
  )
}
