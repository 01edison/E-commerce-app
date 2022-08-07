import React from "react";

const Checkbox = ({ categories, setChecked, checked }) => {

  const handleToggle = (e) => {
    const { value: categoryId } = e.target;

    const currentCategoryIdPos = checked.indexOf(categoryId);

    if (currentCategoryIdPos === -1) {
      setChecked([...checked, categoryId]);
    } else {
      setChecked(checked.filter((c) => c !== categoryId));
    }
  };

  return categories.map((category, index) => {
    return (
      <li key={index} className="list-unstyled">
        <input
          type="checkbox"
          className="form-check-input"
          onChange={handleToggle}
          value={category._id}
        />
        <label htmlFor="">{category.name}</label>
      </li>
    );
  });
};

export default Checkbox;
