import { javascript } from "@codemirror/lang-javascript"
import { python } from "@codemirror/lang-python"
import { cpp } from "@codemirror/lang-cpp"
import CodeMirror, { highlightActiveLine, highlightActiveLineGutter, highlightSpecialChars, lineNumbers } from "@uiw/react-codemirror"
import { githubDark } from "@uiw/codemirror-theme-github"

export function IDE({ code, updateCode }: {
    code: string,
    updateCode: (value: string) => void
}) {
    return (
        <div className={'w-full h-full p-3 flex flex-col'}>
            <CodeMirror
                value={code}
                height="100%"
                width="100%"
                className='flex-1 rounded-md overflow-hidden text-lg'
                extensions={[
                    javascript({ jsx: true }),
                    python(),
                    cpp(),
                    lineNumbers(),
                    highlightActiveLine(),
                    highlightActiveLineGutter(),
                    highlightSpecialChars(),
                ]}
                onChange={updateCode}
                theme={githubDark}
            />
        </div>
    )
}