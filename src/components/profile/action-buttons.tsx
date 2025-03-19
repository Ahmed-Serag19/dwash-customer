interface ActionButtonsProps {
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  t: (key: string) => string;
}

const ActionButtons = ({ editMode, setEditMode, t }: ActionButtonsProps) => {
  return (
    <div className="col-span-2 flex justify-center mt-4">
      {editMode ? (
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded-lg"
        >
          {t("save")}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setEditMode(true)}
          className="bg-primary text-white px-6 py-2 rounded-lg"
        >
          {t("edit")}
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
