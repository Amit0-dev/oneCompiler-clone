export interface Language {
    id: string;
    name: string;
    extension: string;
    iconColor: string;
    codeTemplate: string;
    successOutput: string;
    errorOutput: string;
}

export const LANGUAGES: Language[] = [
    {
        id: 'js',
        name: 'JavaScript',
        extension: 'index.js',
        iconColor: 'text-yellow-400',
        codeTemplate: `// JavaScript Compiler Demo\nfunction greet(name) {\n  console.log(\`Hello, \${name}!\`);\n  console.log("Welcome to OneCompiler Clone!");\n}\n\ngreet("Developer");`,
        successOutput: `Hello, Developer!\nWelcome to OneCompiler Clone!\n\n[Process completed with exit code 0]`,
        errorOutput: `ReferenceError: name is not defined\n    at greet (index.js:3:15)\n    at index.js:6:1\n\n[Process completed with exit code 1]`
    },
    {
        id: 'py',
        name: 'Python',
        extension: 'main.py',
        iconColor: 'text-blue-400',
        codeTemplate: `# Python Compiler Demo\ndef greet(name: str):\n    print(f"Hello, {name}!")\n    print("Welcome to OneCompiler Clone!")\n\ngreet("Developer")`,
        successOutput: `Hello, Developer!\nWelcome to OneCompiler Clone!\n\n[Process completed with exit code 0]`,
        errorOutput: `Traceback (most recent call last):\n  File "main.py", line 5, in <module>\n    greet()\nTypeError: greet() missing 1 required positional argument: 'name'\n\n[Process completed with exit code 1]`
    },
    {
        id: 'cpp',
        name: 'C++',
        extension: 'main.cpp',
        iconColor: 'text-indigo-400',
        codeTemplate: `// C++ Compiler Demo\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, Developer!" << std::endl;\n    std::cout << "Welcome to OneCompiler Clone!" << std::endl;\n    return 0;\n}`,
        successOutput: `Hello, Developer!\nWelcome to OneCompiler Clone!\n\n[Process completed with exit code 0]`,
        errorOutput: `main.cpp: In function 'int main()':\nmain.cpp:5:5: error: 'cout' is not a member of 'std'\n     std::cout << "Hello, Developer!" << std::endl;\n     ^~~\n\n[Process completed with exit code 1]`
    }
];