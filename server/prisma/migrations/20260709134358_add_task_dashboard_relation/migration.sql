-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "Dashboard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
