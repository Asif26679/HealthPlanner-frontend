import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ Import separately

export const exportDietPDF = (diet) => {
  if (!diet) return alert("No diet data found!");

  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text(diet.title || "Daily Diet Plan", 14, 20);

  // User Info
  doc.setFontSize(12);
  doc.text(`Age: ${diet.age || "-"}`, 14, 30);
  doc.text(`Weight: ${diet.weight || "-"} kg`, 14, 36);
  doc.text(`Height: ${diet.height || "-"} cm`, 14, 42);
  doc.text(`Gender: ${diet.gender || "-"}`, 14, 48);

  // Table for meals
  let startY = 55;
  diet.meals?.forEach((meal) => {
    doc.setFontSize(14);
    doc.text(`${meal.name}`, 14, startY);
    startY += 6;

    const mealData = meal.items?.map((item, index) => [
      index + 1,
      item.name,
      item.calories,
      item.protein,
      item.carbs,
      item.fats,
    ]) || [];

    autoTable(doc, {
      startY,
      head: [["#", "Food", "Calories", "Protein", "Carbs", "Fats"]],
      body: mealData,
      theme: "grid",
      headStyles: { fillColor: [72, 187, 120] },
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 },
    });

    startY = doc.lastAutoTable.finalY + 10;
  });

  // Totals
  doc.setFontSize(14);
  doc.text("Totals", 14, startY);
  autoTable(doc, {
    startY: startY + 4,
    head: [["Calories", "Protein", "Carbs", "Fats"]],
    body: [
      [
        diet.totalCalories || 0,
        diet.totalProtein || 0,
        diet.totalCarbs || 0,
        diet.totalFats || 0,
      ],
    ],
    theme: "grid",
    headStyles: { fillColor: [72, 187, 120] },
    styles: { fontSize: 10 },
    margin: { left: 14, right: 14 },
  });

  doc.save(`${diet.title || "diet-plan"}.pdf`);
};
