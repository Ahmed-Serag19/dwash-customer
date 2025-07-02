"use client";

import { useTranslation } from "react-i18next";
import { Calendar, Grid } from "lucide-react";

interface ViewModeToggleProps {
  viewMode: "all" | "byDate";
  onViewModeChange: (mode: "all" | "byDate") => void;
}

const ViewModeToggle = ({
  viewMode,
  onViewModeChange,
}: ViewModeToggleProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => onViewModeChange("byDate")}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          viewMode === "byDate"
            ? "bg-primary text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        <Calendar className="h-4 w-4" />
        {t("viewByDate")}
      </button>
      <button
        onClick={() => onViewModeChange("all")}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          viewMode === "all"
            ? "bg-primary text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        <Grid className="h-4 w-4" />
        {t("viewAll")}
      </button>
    </div>
  );
};

export default ViewModeToggle;
