import { X } from "lucide-react";

const FormModal = ({
  show,
  title = "Form",
  fields = [],
  values = {},
  onChange,
  onSubmit,
  onClose,
  loading = false,
  submitText = "Submit",
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X size={22} />
        </button>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block font-medium mb-1">{field.label}</label>
              {field.type === "file" ? (
                <input
                  type="file"
                  name={field.name}
                  accept={field.accept || "*"}
                  onChange={onChange}
                  required={field.required}
                  className="w-full"
                />
              ) : (
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={values[field.name] || ""}
                  onChange={onChange}
                  required={field.required}
                  className="w-full border border-gray-300 rounded p-2"
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white ${
              loading ? "bg-gray-600" : "bg-black hover:bg-black/80"
            }`}
          >
            {loading ? "Processing..." : submitText}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
