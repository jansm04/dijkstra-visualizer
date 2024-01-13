'use client'
import { useDraw } from "@/hooks/useDraw"

// components
import Header from "./header"
import PriorityQueue from "./pq"
import Canvas from "./canvas"
import Select from "./select"
import Instructions from "./instructions"
import Options from "./options"
import Footer from "./footer"
import Box from "@mui/material/Box"
import Slider from "@mui/material/Slider"

const marks = [
    {
      value: 1,
      label: '.25x',
    },
    {
      value: 2,
      label: '.5x',
    },
    {
      value: 3,
      label: '1x',
    },
    {
      value: 4,
      label: '2x',
    },
    {
      value: 5,
      label: '4x',
    }
  ];

const style = {
color: 'teal',
height: 5,
padding: '15px 0',
'& .MuiSlider-thumb': {
  height: 20,
  width: 20,
  backgroundColor: '#fff',
  boxShadow: '0 0 2px 0px rgba(0, 0, 0, 0.1)',
  '&:focus, &:hover, &.Mui-active': {
    boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.1)'
  },
  '&:before': {
    boxShadow:
      '0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)',
  },
},
'& .MuiSlider-track': {
  border: 'none',
  height: 5,
},
'& .MuiSlider-rail': {
  opacity: 0.5,
  boxShadow: 'inset 0px 0px 4px -2px #000',
  backgroundColor: '#d0d0d0',
},
};

export const Main = () => {

    const { refs } = useDraw();

    return (
        <div>
            <Header />
            <div className="flex">
                 <PriorityQueue pqRef={refs.pqRef} />
                 <div>
                    <Canvas canvasRef={refs.canvasRef} />
                    <Select refs={refs} />
                </div>
                <div>
                    <Instructions />
                    <Options refs={refs} />
                    <div className="mx-8 my-2">
                    <Box sx={{ width: 180 }}>
                        <Slider 
                            ref={refs.sliderRef}
                            sx={style}
                            size="small"
                            aria-label="Custom marks"
                            defaultValue={3}
                            step={null}
                            min={1}
                            max={5}
                            valueLabelDisplay="off"
                            marks={marks} 
                        />
                    </Box>
                    </div>
                    
                    
                </div>
                
            </div>
            <Footer />
        </div>
            
    )
}