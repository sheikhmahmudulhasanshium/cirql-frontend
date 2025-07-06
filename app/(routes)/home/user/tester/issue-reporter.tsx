'use client';

import { BugReportModal } from "./bug-report-modal";


const IssueReporter = () => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <h3 className="text-xl font-semibold">Submit a New Bug Report</h3>
      <p className="text-muted-foreground mt-2 mb-4">
        Found something that isn&apos;t working as expected? Use the form to send a detailed report directly to the development team.
      </p>
      <BugReportModal />
    </div>
  );
};

export default IssueReporter;