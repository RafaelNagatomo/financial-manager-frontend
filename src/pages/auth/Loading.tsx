import { useEffect } from "react"
import { useNavigate } from "react-router-dom" 
import { Box } from "@chakra-ui/react"
import { motion, useAnimate } from "framer-motion"

const MotionPath = motion.path
const MotionCircle = motion.circle
const MotionBox = motion(Box)

export default function FiManagerLoader() {
  const [scope, animate] = useAnimate()
  const navigate = useNavigate()
  const isMobile = window.innerWidth <= 768
  const isTablet = window.innerWidth <= 992

  useEffect(() => {
    const animateLoader = async () => {
      await animate(
        ".logoPath",
        {
          pathLength: [0, 1],
          pathOffset: [1, 0],
          strokeWidth: 45,
          fill: 'none',
          stroke: "black"
        },
        {
          duration: 1,
          ease: [0.42, 0, 0.58, 1]
        },
      )
      await animate(
        ".dot",
        { y: [0, 30, 0] },
        {
          duration: 1,
          ease: [0.3, 0, 0.5, 1],
          repeat: Infinity,
          repeatType: "reverse"
        }
      )
    }
    setTimeout(() => {
      navigate("/dashboard")
    }, 5500)
    animateLoader()
  }, [animate, navigate])

  return (
    <MotionBox
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1.5, ease: 'backInOut' }}
      overflowX='hidden'
    >
      <Box position="relative" ref={scope}>
        <svg
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          width={ isMobile ? "250pt" : isTablet ? "400pt" : "700pt" }
          height="180pt"
          viewBox="0 0 611.000000 114.000000"
          preserveAspectRatio="xMidYMid meet"
        >
          <g
            transform="translate(0.000000,114.000000) scale(0.100000,-0.100000)"
            fill="#000000"
            stroke="none"
          >
            <MotionPath
              className="logoPath"
              initial={{ pathLength: 1, pathOffset: 1 }}
              d="M295 936 l-230 -132 -2 -275 -3 -274 134 -77 c74 -42 137 -74 140
              -70 3 3 6 56 6 119 0 62 2 113 5 113 3 0 42 -21 87 -47 44 -25 86 -46 93 -46
              7 0 49 21 93 46 45 26 86 47 92 47 6 0 10 -43 10 -119 l0 -120 135 77 135 77
              -2 274 -3 275 -175 101 c-96 55 -200 115 -230 132 l-55 32 -230 -133z m413
              -47 c97 -56 179 -103 181 -105 6 -6 -25 -28 -85 -60 l-50 -27 -182 104 c-100
              57 -182 106 -182 109 0 7 121 79 133 80 4 0 87 -46 185 -101z m-207 -121 c99
              -57 178 -106 176 -110 -1 -4 -35 -27 -76 -51 l-75 -44 -125 72 -126 73 -5
              -247 -5 -248 -70 42 -70 41 -3 231 -2 232 92 55 c51 31 97 55 102 56 5 0 89
              -46 187 -102z m425 -464 c-4 -11 -125 -84 -139 -84 -4 0 -8 54 -9 119 l-3 119
              -123 -70 c-139 -80 -119 -80 -244 -7 l-68 40 0 84 c0 47 2 85 4 85 3 0 44 -23
              92 -51 l88 -50 41 22 c22 13 112 65 200 115 l160 93 3 -202 c1 -111 0 -207 -2
              -213z"
            />
            <MotionPath
            className="logoPath"
            initial={{ pathLength: 1, pathOffset: 1 }}
              d="M1422 928 c-9 -9 -12 -90 -12 -314 0 -166 3 -309 6 -318 8 -21 50
              -21 58 0 3 9 6 76 6 150 l0 134 139 0 c111 0 141 3 151 15 10 12 10 18 0 30
              -10 12 -40 15 -151 15 l-139 0 0 120 0 120 193 2 192 3 0 25 0 25 -215 3
              c-159 2 -219 -1 -228 -10z"
            />
            <MotionPath
            className="logoPath"
            initial={{ pathLength: 1, pathOffset: 1 }}
              d="M2222 928 c-9 -9 -12 -94 -12 -319 0 -325 2 -336 47 -327 17 3 18 23
              23 248 l5 244 120 -239 c96 -190 125 -240 140 -240 16 0 45 50 142 245 l121
              245 4 -250 c3 -231 4 -250 21 -253 45 -9 47 2 47 322 0 316 -4 348 -43 333 -9
              -3 -78 -129 -153 -279 l-137 -273 -138 278 c-141 281 -153 299 -187 265z"
            />
            <MotionPath
              className="logoPath"
              initial={{ pathLength: 1, pathOffset: 1 }}
                d="M3181 739 c-53 -10 -96 -39 -134 -87 -77 -100 -52 -269 51 -337 45
                -29 124 -48 166 -39 40 8 99 38 115 58 16 19 35 21 28 4 -2 -7 0 -23 4 -36 6
                -17 15 -22 31 -20 23 3 23 5 23 153 0 124 -3 156 -17 182 -53 97 -157 145
                -267 122z m146 -80 c125 -77 96 -281 -46 -319 -171 -46 -292 168 -166 295 58
                58 142 67 212 24z"
            />
            <MotionPath
            className="logoPath"
            initial={{ pathLength: 1, pathOffset: 1 }}
              d="M3751 740 c-18 -4 -46 -17 -62 -29 -35 -26 -37 -26 -41 2 -2 16 -10
              22 -28 22 l-25 0 0 -225 0 -225 25 0 25 0 5 161 c4 144 7 164 25 184 49 54
              145 69 206 34 58 -35 69 -71 69 -232 0 -123 2 -143 16 -149 9 -3 23 -2 32 3
              12 8 15 37 14 161 -1 170 -12 210 -74 256 -54 41 -117 53 -187 37z"
            />
            <MotionPath
            className="logoPath"
            initial={{ pathLength: 1, pathOffset: 1 }}
              d="M4305 741 c-120 -31 -199 -147 -181 -264 17 -106 82 -176 182 -197
              70 -15 146 5 189 50 l30 32 5 -39 c4 -33 9 -38 30 -38 l25 0 3 130 c3 147 -6
              196 -49 248 -50 61 -159 97 -234 78z m140 -80 c117 -68 109 -245 -15 -309
              -114 -59 -240 25 -240 159 0 137 139 218 255 150z"
            />
            <MotionPath
            className="logoPath"
            initial={{ pathLength: 1, pathOffset: 1 }}
              d="M4864 741 c-165 -41 -236 -239 -134 -379 77 -107 261 -115 339 -16
              l21 27 0 -40 c0 -47 -35 -120 -71 -146 -61 -44 -152 -40 -225 12 -49 34 -72
              39 -81 15 -8 -20 40 -69 94 -95 48 -23 149 -28 198 -9 51 20 94 59 120 110 23
              46 25 59 25 200 0 164 -8 201 -58 253 -53 56 -154 86 -228 68z m121 -70 c70
              -32 105 -86 105 -162 0 -140 -147 -221 -268 -147 -44 27 -72 85 -72 149 0 131
              120 213 235 160z"
            />
            <MotionPath
               className="logoPath"
               initial={{ pathLength: 1, pathOffset: 1 }}
              d="M5411 740 c-163 -40 -220 -260 -103 -397 60 -69 188 -88 278 -42 31
              16 50 33 52 46 5 31 -25 36 -67 11 -50 -31 -132 -31 -183 0 -41 25 -78 78 -78
              110 0 21 4 22 183 24 l182 3 -1 52 c-4 130 -133 225 -263 193z m106 -61 c15
              -6 39 -20 52 -32 22 -21 30 -36 45 -84 l7 -23 -155 0 c-171 0 -172 1 -142 58
              39 75 120 109 193 81z"
            />
            <MotionPath
              className="logoPath"
              initial={{ pathLength: 1, pathOffset: 1 }}
              d="M5927 735 c-22 -7 -49 -23 -62 -35 l-23 -22 -4 28 c-2 23 -8 29 -28
              29 l-25 0 0 -225 0 -225 25 0 25 0 5 160 c3 103 10 168 18 182 20 36 70 56
              137 57 54 1 60 3 63 23 6 40 -60 54 -131 28z"
            />
            <MotionPath
              className="logoPath"
              initial={{ pathLength: 1, pathOffset: 1 }}
              d="M1995 728 c-3 -7 -4 -110 -3 -228 l3 -215 25 0 25 0 0 225 0 225 -23
              3 c-12 2 -24 -3 -27 -10z"
            />
          </g>
          <MotionCircle
            className="dot"
            cx="202"
            cy="10"
            r="7"
            fill="black"
            initial={{ translateY: -10 }}
          />
        </svg>
        <MotionBox
          w="100%"
          h="6px"
          bg="#ddd"
          mt="20px"
          borderRadius="2.5px"
          overflow="hidden"
        >
          <MotionBox
            width="0%"
            height="100%"
            bg="purple.500"
            animate={{
              width: ["0%", "40%", "45%", "80%", "85%", "100%"],
            }}
            transition={{
              duration: 5,
              ease: ["easeOut", "circOut", "circIn", "easeOut", "circIn", "linear"],
              times: [0, 0.4, 0.6, 0.7, 0.85, 1]
            }}
          />
        </MotionBox>
      </Box>
    </MotionBox>
  )
}
