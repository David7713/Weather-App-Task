import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Weather from './Weather/Weather'

const App = () => {
  return (
    <div>
       <Router>
        <Routes>
        <Route path="/" element={ <Weather /> } />
        <Route path="/Weather" element={ <Weather /> } />
        </Routes>
       </Router>

    </div>
  )
}

export default App
































// import React from 'react'
// import Weatherr from './Weather/Weatherr'
// const App = () => {
//   return (
//     <div>
//           <Weatherr></Weatherr>
//     </div>
//   )
// }

// export default App