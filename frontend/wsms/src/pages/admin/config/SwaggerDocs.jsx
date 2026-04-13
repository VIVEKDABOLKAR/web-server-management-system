import DashboardLayout from "../../../components/dashboard/DashboardLayout";

const SwaggerDocs = () => {
  return (
    <DashboardLayout pageTitle="Swagger UI">
      <div className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Swagger UI</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              API documentation opened inside the frontend shell.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
          <iframe
            title="Swagger UI"
            src="http://localhost:8080/swagger-ui.html"
            className="h-[calc(100vh-14rem)] w-full"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SwaggerDocs;