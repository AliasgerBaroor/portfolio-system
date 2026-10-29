import type { SVGProps } from "react";

export function ClientsBgIcon(
    props: SVGProps<SVGSVGElement>
) {
    return (
        <svg
            width="1038"
            height="166"
            viewBox="0 0 1038 166"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            {...props}
        >
            <mask
                id="mask0_clients"
                style={{ maskType: "alpha" }}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="1038"
                height="166"
            >
                <rect
                    width="1038"
                    height="155"
                    fill="#F84F2E"
                />

                <rect
                    width="1038"
                    height="31.7808"
                    transform="matrix(1 0 0 -1 0 165.781)"
                    fill="url(#pattern0_clients)"
                />
            </mask>

            <g mask="url(#mask0_clients)">
                <rect
                    y="-6"
                    width="1038"
                    height="172"
                    fill="#F84F2E"
                />

                <rect
                    y="-6"
                    width="1038"
                    height="172"
                    fill="url(#pattern1_clients)"
                />
            </g>

            <defs>
                <pattern
                    id="pattern0_clients"
                    patternUnits="userSpaceOnUse"
                    patternTransform="matrix(55.17 0 0 30.87 0 0)"
                    preserveAspectRatio="none"
                    viewBox="0 0 306.5 171.5"
                    width="1"
                    height="1"
                >
                    <g>
                        <path
                            d="M0 41C33.5 41 45 -2.87708e-05 77 0C109 -2.87708e-05 120 41 153.5 41C187 41 198 -2.87708e-05 230 0C262 -2.87708e-05 273 41 306.5 41V171.5H0V41Z"
                            fill="#F84F2E"
                        />
                    </g>
                </pattern>

                <pattern
                    id="pattern1_clients"
                    patternUnits="userSpaceOnUse"
                    patternTransform="matrix(48 0 0 48 0 -6)"
                    preserveAspectRatio="none"
                    viewBox="0 0 16 16"
                    width="1"
                    height="1"
                >
                    <g opacity="0.5">
                        <rect
                            x="7.5"
                            width="0.5"
                            height="16"
                            fill="#221E15"
                        />

                        <rect
                            x="16"
                            y="7.5"
                            width="0.5"
                            height="16"
                            transform="rotate(90 16 7.5)"
                            fill="#221E15"
                        />
                    </g>
                </pattern>
            </defs>
        </svg>
    );
}