import { Room, Client } from "colyseus"
import { MainRoomState, Player, SkinColor } from './schema/MainRoomState'
import 'dotenv/config'

export class MainRoom extends Room<MainRoomState> {
  /*async onAuth (client: Client, options: any, request: any) {
    if (options.accessToken === process.env.TOKEN) {
      return true;
    } else {
      throw new ServerError(400, "bad access token");
    }
  }*/

  onCreate (options: any) {
    this.maxClients = 4
    this.setState(new MainRoomState())
    
    this.onMessage('createPlayer', (client, message) => {
      if (message.playerId.includes('guest_')) {
        const data: any = {
          id: message.playerId,
          skinColor: message.skinColor
        }
        
        this.pushData(data, client.sessionId)
      }
    })
  
    this.onMessage('syncForward', (client, message) => {
      this.broadcast('syncForward', message, { except: client })
    })

    this.onMessage('syncJump', (client, message) => {
      this.broadcast('syncJump', message, { except: client })
    })
    
    this.onMessage('syncData', (client, message) => {
      this.broadcast('syncData', message, { except: client })
    })
  }

  onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!")
  }

  onLeave (client: Client, consented: boolean) {
    const playerIndex = this.state.players.findIndex(player => player.clientSessionId === client.sessionId)
    this.state.players.splice(playerIndex, 1)
    
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
  
  pushData(data: any, sessionId: string) {
    let player: Player = new Player()
    const skinColor = new SkinColor();

    player.id = data.id
    player.clientSessionId = sessionId

    skinColor.r = data.skinColor.r
    skinColor.g = data.skinColor.g
    skinColor.b = data.skinColor.b

    player.skinColor= skinColor

    this.state.players.push(player)
  }
}
