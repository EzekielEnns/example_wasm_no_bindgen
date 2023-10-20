#![allow(dead_code)]

const WIDTH:usize = 90;
const HEIGHT:usize = 30;

static mut WORLD: Game = Game{
   player:Entity{
       pos: Pos{y:HEIGHT as u32/2,x:WIDTH as u32/2},
       value: b'@',
       update: b'0',
   },
   level: [b'.';HEIGHT*WIDTH],
   map: [b'.';HEIGHT*WIDTH]
};


//https://tung.github.io/posts/rust-and-webassembly-without-a-bundler/
#[no_mangle]
pub extern "C" fn add(left: usize, right: usize) -> usize {
    left + right
}
#[no_mangle]                    //TODO use a single u8
pub unsafe extern "C" fn plyMove(v:u8) {
    WORLD.player.update |= v;
}

#[no_mangle]
pub unsafe extern "C" fn tick()->*const u8{
    //copy this over TODO better way to do it 
    WORLD.map = WORLD.level;
    let update = WORLD.player.update;
    if update & 0b10000000 != 0 {
        WORLD.player.pos.x -= 1;
    }
    if update & 0b01000000 != 0 {
        WORLD.player.pos.y += 1;
    }
    if update & 0b00100000 != 0 {
        WORLD.player.pos.y -= 1;
    }
    if update & 0b00010000 != 0 {
        WORLD.player.pos.x += 1;
    }
    WORLD.player.update = 0;
    WORLD.map[Game::get_index(&WORLD.player.pos)] = WORLD.player.value;
    WORLD.map.as_ptr()
}

#[no_mangle]
pub unsafe extern "C" fn get_height()->usize{
    HEIGHT
}
#[no_mangle]
pub unsafe extern "C" fn get_width()->usize{
    WIDTH
}

#[repr(C)] 
pub struct Game {
    player: Entity,
    level: [u8; WIDTH*HEIGHT],
    map: [u8; WIDTH*HEIGHT],
}

impl Game {
    fn get_index(p: &Pos)-> usize{
        return (p.y * WIDTH as u32 + p.x) as usize;
    }
}

#[derive(Copy,Clone,Debug)]
pub struct Pos {
    y:u32,
    x:u32
}

pub struct Entity {
    pos: Pos,
    value: u8,
    update: u8
}


#[cfg(test)]
mod tests {

    use super::*;

    #[test]
    fn it_works() {
        unsafe {
            println!("hi");
            tick();
        }
    }
}
