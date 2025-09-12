import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ Import separately

export const exportDietPDF = (diet, user) => {
  if (!diet) return alert("No diet data found!");

  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text(diet.title || "Daily Diet Plan", 14, 20);

  // User Info
  doc.setFontSize(12);
  let currentY = 30;

  doc.text(`User: ${user?.name || "N/A"}`, 14, currentY);
  currentY += 6;
  doc.text(`Age: ${diet.age || "-"}`, 14, currentY);
  currentY += 6;
  doc.text(`Weight: ${diet.weight || "-"} kg`, 14, currentY);
  currentY += 6;
  doc.text(`Height: ${diet.height || "-"} cm`, 14, currentY);
  currentY += 6;
  doc.text(`Gender: ${diet.gender || "-"}`, 14, currentY);

  currentY += 10; // ✅ Add gap before meals

  // Meals Section
  let startY = currentY;
  diet.meals?.forEach((meal) => {
    doc.setFontSize(14);
    doc.text(`${meal.name}`, 14, startY);
    startY += 6;

    const mealData =
      meal.items?.map((item, index) => [
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

    startY = doc.lastAutoTable.finalY + 10; // move down for next meal
  });

  // Totals Section
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

  // Save PDF
  doc.save(`${diet.title || "diet-plan"}.pdf`);
};
