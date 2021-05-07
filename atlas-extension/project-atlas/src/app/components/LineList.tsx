import { memo } from "react";

export interface LineListProps {
    lines: string[];
}

const LineList = memo(function ({ lines }: LineListProps) {
    return (
        <>
            {lines.map((line, index) => (
                <div key={index} className="line" style={{ transform: `translate(0, ${index * 25})` }}>
                    <span style={{ display: "inline-block", marginInlineEnd: "10px" }}>{index + 1}.</span>
                    <div style={{ display: "inline-block", marginInlineEnd: "10px" }}>{line}</div>
                </div>
            ))}
        </>
    );
});

export default LineList;
