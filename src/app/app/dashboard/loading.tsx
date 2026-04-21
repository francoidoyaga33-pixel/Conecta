export default function DashboardLoading() {
  return (
    <div className="flex-1 p-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
            <div className="h-10 w-10 rounded-lg bg-gray-100 mb-4" />
            <div className="h-6 w-12 bg-gray-100 rounded mb-2" />
            <div className="h-3 w-24 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
