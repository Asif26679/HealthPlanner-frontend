// utils/exportDiet.js
import jsPDF from "jspdf";
import "jspdf-autotable"; // for table support

export const exportDietPDF = (user, diet) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text("Daily Diet Report", 105, 15, { align: "center" });

  // User Info
  doc.setFontSize(12);
  doc.text(`Name: ${user.name || "User"}`, 14, 30);
  doc.text(`Age: ${user.age || "-"}`, 14, 37);
  doc.text(`Gender: ${user.gender || "-"}`, 14, 44);
  doc.text(`Weight: ${user.weight || "-"} kg`, 14, 51);
  doc.text(`Height: ${user.height || "-"} cm`, 14, 58);
  doc.text(`Activity Level: ${user.activityLevel || "-"}`, 14, 65);

  // Diet Summary
  doc.text(`Total Calories: ${diet.totalCalories || 0} kcal`, 14, 75);
  doc.text(`Protein: ${diet.totalProtein || 0} g`, 14, 82);
  doc.text(`Carbs: ${diet.totalCarbs || 0} g`, 14, 89);
  doc.text(`Fats: ${diet.totalFats || 0} g`, 14, 96);

  let startY = 110;

  // Meals and Items
  diet.meals.forEach((meal) => {
    doc.setFontSize(14);
    doc.text(meal.name, 14, startY);
    startY += 6;

    const mealData = meal.items.map((item) => [
      item.name,
      `${item.calories} kcal`,
      `${item.protein} g`,
      `${item.carbs} g`,
      `${item.fats} g`,
    ]);

    doc.autoTable({
      startY,
      head: [["Item", "Calories", "Protein", "Carbs", "Fats"]],
      body: mealData,
      theme: "grid",
      headStyles: { fillColor: [34, 197, 94] },
      styles: { fontSize: 10 },
      margin: { left: 14, right: 14 },
    });

    startY = doc.lastAutoTable.finalY + 10; // move below table
  });

  doc.save("Diet_Report.pdf");
};
