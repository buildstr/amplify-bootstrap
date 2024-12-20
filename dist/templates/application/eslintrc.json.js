export const eslintrcJson = (props) => {
    return `{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "overrides": [
    {
      "files": ["*.ts", "*.tsx"],
      "rules": {
        "prefer-const": "warn",
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/no-explicit-any": "warn"
      }
    }
  ] 
}`;
};
export default eslintrcJson;
