import { useEffect, useState } from "react";
import { Line, Pie, Bar } from "react-chartjs-2";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import jsPDF from "jspdf";
import "chart.js/auto";

const MoodDashboard = () => {
  const [moodLogs, setMoodLogs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/moods")
      .then(res => res.json())
      .then(data => setMoodLogs(data));
  }, []);

  const exportPDF = () => {
    const pdf = new jsPDF();
    pdf.text("Mood Progress Dashboard", 20, 20);
    pdf.text(`Total Logs: ${moodLogs.length}`, 20, 35);
    pdf.save("mood-report.pdf");
  };

  const moodTrend = {
    labels: moodLogs.map(e => new Date(e.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: "Mood Trend",
        data: moodLogs.map(e => e.mood),
        borderColor: "blue",
      }
    ]
  };

  const sentimentCounts = moodLogs.reduce(
    (a, e) => ({ ...a, [e.sentiment]: (a[e.sentiment] || 0) + 1 }),
    {}
  );

  const activityCounts = moodLogs.reduce(
    (a, e) => ({ ...a, [e.activity]: (a[e.activity] || 0) + 1 }),
    {}
  );

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Mood Progress Dashboard</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader><CardTitle>Mood Trend Over Time</CardTitle></CardHeader>
          <CardContent><Line data={moodTrend} /></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Sentiment Distribution</CardTitle></CardHeader>
          <CardContent>
            <Pie
              data={{
                labels: Object.keys(sentimentCounts),
                datasets: [{ data: Object.values(sentimentCounts) }]
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Most Used Activities</CardTitle></CardHeader>
          <CardContent>
            <Bar
              data={{
                labels: Object.keys(activityCounts),
                datasets: [{ data: Object.values(activityCounts) }]
              }}
            />
          </CardContent>
        </Card>
      </div>

      <Button className="mt-8" onClick={exportPDF}>📄 Download Report</Button>
    </div>
  );
};

export default MoodDashboard;
