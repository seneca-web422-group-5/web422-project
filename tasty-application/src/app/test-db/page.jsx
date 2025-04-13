// app/test-db/page.jsx
import TestDatabase from '../../components/TestDatabaseClient';

export default function TestDbPage() {
  return (
    <div>
      <h1>Test DB Page</h1>
      {/* Render the TestDatabase component which displays users from the DB */}
      <TestDatabase />
    </div>
  );
}
