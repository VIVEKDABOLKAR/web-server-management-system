import React from "react";
import AddButton from "../AddButton";

/**
 * Example component showing how to use AddButton in different contexts
 * This file can be deleted after reference - it's just for demonstration
 */
const AddButtonExamples = () => {
  const handleAddServer = () => {
    alert("Add Server clicked!");
  };

  const handleAddUser = () => {
    alert("Add User clicked!");
  };

  const handleAddRule = () => {
    alert("Add Rule clicked!");
  };

  return (
    <div className="p-8 bg-white dark:bg-slate-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
        AddButton Component Examples
      </h2>

      <div className="space-y-8">
        {/* Primary Variants */}
        <section>
          <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-200">
            Primary Variant (Default)
          </h3>
          <div className="flex flex-wrap gap-4">
            <AddButton
              title="Add Server"
              onClick={handleAddServer}
              size="sm"
            />
            <AddButton
              title="Add Server"
              onClick={handleAddServer}
              size="md"
            />
            <AddButton
              title="Add Server"
              onClick={handleAddServer}
              size="lg"
            />
            <AddButton
              title="Add Server"
              onClick={handleAddServer}
              disabled
            />
          </div>
        </section>

        {/* Secondary Variant */}
        <section>
          <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-200">
            Secondary Variant
          </h3>
          <div className="flex flex-wrap gap-4">
            <AddButton
              title="Add User"
              onClick={handleAddUser}
              variant="secondary"
              size="md"
            />
            <AddButton
              title="Add Rule"
              onClick={handleAddRule}
              variant="secondary"
              size="lg"
            />
          </div>
        </section>

        {/* Outline Variant */}
        <section>
          <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-200">
            Outline Variant
          </h3>
          <div className="flex flex-wrap gap-4">
            <AddButton
              title="Add Item"
              onClick={handleAddServer}
              variant="outline"
              size="md"
            />
            <AddButton
              title="Add Document"
              onClick={handleAddServer}
              variant="outline"
              size="lg"
            />
          </div>
        </section>

        {/* With Icons (emoji as placeholder) */}
        <section>
          <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-200">
            With Icons
          </h3>
          <div className="flex flex-wrap gap-4">
            <AddButton
              title="Add Server"
              onClick={handleAddServer}
              icon="🖥️"
              size="md"
            />
            <AddButton
              title="Add User"
              onClick={handleAddUser}
              variant="secondary"
              icon="👤"
              size="md"
            />
            <AddButton
              title="Add Alert"
              onClick={handleAddRule}
              variant="outline"
              icon="🔔"
              size="md"
            />
          </div>
        </section>

        {/* Usage in ServerTable Context */}
        <section className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-200">
            Real-world Usage in ServerTable
          </h3>
          <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <h4>Server Inventory</h4>
              <AddButton
                title="+ Add Server"
                onClick={handleAddServer}
                icon="➕"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AddButtonExamples;
