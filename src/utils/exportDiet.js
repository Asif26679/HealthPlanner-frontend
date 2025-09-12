import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ Correct import

export const exportDietPDF = (diet) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(16);
  doc.text(diet.title || "Daily Diet", 14, 20);

  // User Info
  doc.setFontSize(12);
  doc.text(`Age: ${diet.age || "-"}`, 14, 30);
  doc.text(`Weight: ${diet.weight || "-"} kg`, 14, 36);
  doc.text(`Height: ${diet.height || "-"} cm`, 14, 42);
  doc.text(`Gender: ${diet.gender || "-"}`, 14, 48);

  let y = 55;

  diet.meals.forEach((meal) => {
    doc.setFontSize(14);
    doc.text(meal.name, 14, y);
    y += 6;

    const mealData = meal.items.map((item) => [
      item.name,
      item.calories,
      item.protein,
      item.carbs,
      item.fats,
    ]);

    autoTable(doc, {
      startY: y,
      head: [["Item", "Calories", "Protein", "Carbs", "Fats"]],
      body: mealData,
      theme: "grid",
      headStyles: { fillColor: [34, 197, 94] },
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 },
    });

    y = doc.lastAutoTable.finalY + 10;
  });

  // Total Nutrition
  doc.setFontSize(14);
  doc.text(
    `Total: ${diet.totalCalories} kcal | Protein: ${diet.totalProtein}g | Carbs: ${diet.totalCarbs}g | Fats: ${diet.totalFats}g`,
    14,
    y
  );

  doc.save(`${diet.title || "diet"}.pdf`);
};
