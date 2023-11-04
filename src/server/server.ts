import * as express from 'express'
import * as path from 'path'
import * as dotenv from 'dotenv'
import * as winston from 'winston'

dotenv.config({ path:'.env' })

// Creat logger
export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),    
    defaultMeta: { service: 'user-service' },
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
    ]
  })
  
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple()
    }))
  }
  
export const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
// Serve static assets from the assets directory
app.use(express.static(path.resolve(__dirname)));

console.log(path.basename(__dirname))

app.get('/', (_:any, res:any) => {
  logger.info("New connection")
  res.sendFile(path.resolve(__dirname, 'music.html'))
})

app.post('/api/store-score', (req:any, res:any) => {
  const score: {
    score:number,
    name:string
  } = req.body
  logger.info(`Song ${score.name} achieved with score of ${score.score}`)
  // Add returning percentage
  res.status(200).json("Placeholder")
})
    
app.listen(port, () => {
    logger.info("Server started")
})