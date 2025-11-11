import React, { useState } from 'react';

// This is a single-file React application.
// To run it, save as `calculator.tsx` and use a build tool like Vite or Create React App.
// The instruction "run at 5000 port" refers to the server (like Vite's)
// that would serve this component, not something the component itself does.

// Helper function to format the display
const formatDisplay = (value: string): string => {
  if (value.length > 12) {
    return parseFloat(value).toExponential(3);
  }
  return value;
};

// Main Calculator Button Component
interface ButtonProps {
  onClick: (label: string) => void;
  label: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, label, className = '' }) => (
  <button
    onClick={() => onClick(label)}
    className={`text-2xl sm:text-3xl font-bold bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 rounded-lg shadow-md transition-all duration-150 active:shadow-inner active:translate-y-px ${className}`}
  >
    {label}
  </button>
);

// Main App Component
export default function App() {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState<boolean>(false);

  // Handles calculation logic
  const calculate = (val1: number, val2: number, op: string): number => {
    switch (op) {
      case '+':
        return val1 + val2;
      case '-':
        return val1 - val2;
      case '×':
        return val1 * val2;
      case '÷':
        return val1 / val2;
      default:
        return val2;
    }
  };

  // Handles button clicks
  const handleButtonClick = (label: string) => {
    // Handle number inputs
    if (/\d/.test(label)) {
      if (waitingForOperand) {
        setDisplayValue(label);
        setWaitingForOperand(false);
      } else {
        setDisplayValue(displayValue === '0' ? label : displayValue + label);
      }
      return;
    }

    // Handle decimal point
    if (label === '.') {
      if (waitingForOperand) {
        setDisplayValue('0.');
        setWaitingForOperand(false);
      } else if (!displayValue.includes('.')) {
        setDisplayValue(displayValue + '.');
      }
      return;
    }

    // Handle "AC" (All Clear)
    if (label === 'AC') {
      setDisplayValue('0');
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(false);
      return;
    }

    // Handle "+/-" (Toggle Sign)
    if (label === '±') {
      setDisplayValue((parseFloat(displayValue) * -1).toString());
      return;
    }

    // Handle "%" (Percent)
    if (label === '%') {
      setDisplayValue((parseFloat(displayValue) / 100).toString());
      return;
    }

    // Handle operations (+, -, ×, ÷)
    if (['+', '-', '×', '÷'].includes(label)) {
      const currentValue = parseFloat(displayValue);

      if (previousValue !== null && operation && !waitingForOperand) {
        // Perform existing operation before setting the new one
        const result = calculate(previousValue, currentValue, operation);
        setDisplayValue(result.toString());
        setPreviousValue(result);
      } else {
        setPreviousValue(currentValue);
      }

      setWaitingForOperand(true);
      setOperation(label);
      return;
    }

    // Handle "=" (Equals)
    if (label === '=') {
      const currentValue = parseFloat(displayValue);
      if (previousValue !== null && operation) {
        const result = calculate(previousValue, currentValue, operation);
        setDisplayValue(result.toString());
        setPreviousValue(null); // Reset after calculation
        setOperation(null);
        setWaitingForOperand(true); // Ready for new input
      }
      return;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-4">
      <div className="w-full max-w-xs sm:max-w-sm bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl p-6">
        {/* Display Screen */}
        <div className="mb-6 bg-zinc-100 dark:bg-zinc-900 rounded-lg p-4 text-right">
          <span className="text-4xl sm:text-5xl font-light break-all">
            {formatDisplay(displayValue)}
          </span>
        </div>

        {/* Button Grid */}
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          <Button onClick={handleButtonClick} label="AC" className="bg-orange-400 hover:bg-orange-500 text-white" />
          <Button onClick={handleButtonClick} label="±" className="bg-zinc-300 dark:bg-zinc-600" />
          <Button onClick={handleButtonClick} label="%" className="bg-zinc-300 dark:bg-zinc-600" />
          <Button onClick={handleButtonClick} label="÷" className="bg-blue-500 hover:bg-blue-600 text-white" />

          <Button onClick={handleButtonClick} label="7" />
          <Button onClick={handleButtonClick} label="8" />
          <Button onClick={handleButtonClick} label="9" />
          <Button onClick={handleButtonClick} label="×" className="bg-blue-500 hover:bg-blue-600 text-white" />

          <Button onClick={handleButtonClick} label="4" />
          <Button onClick={handleButtonClick} label="5" />
          <Button onClick={handleButtonClick} label="6" />
          <Button onClick={handleButtonClick} label="-" className="bg-blue-500 hover:bg-blue-600 text-white" />

          <Button onClick={handleButtonClick} label="1" />
          <Button onClick={handleButtonClick} label="2" />
          <Button onClick={handleButtonClick} label="3" />
          <Button onClick={handleButtonClick} label="+" className="bg-blue-500 hover:bg-blue-600 text-white" />

          <Button onClick={handleButtonClick} label="0" className="col-span-2" />
          <Button onClick={handleButtonClick} label="." />
          <Button onClick={handleButtonClick} label="=" className="bg-green-500 hover:bg-green-600 text-white" />
        </div>
      </div>
    </div>
  );
}
