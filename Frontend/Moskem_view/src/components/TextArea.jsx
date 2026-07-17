export function TextArea({ text, valueData, textId, updateData }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-md font-semibold text-[#004B57] ">{text}</label>
      <textarea
        className="bg-[#D9D9D9]/50 border-none rounded-lg p-2 text-gray-700 font-medium focus:ring-2 focus:ring-[#009BAE] outline-none transition-all"
        value={valueData}
        id={textId}
        name={textId}
        onChange={updateData}
      ></textarea>
    </div>
  );
}