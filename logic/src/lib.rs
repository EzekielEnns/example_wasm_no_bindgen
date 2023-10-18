#![allow(dead_code)]

const WIDTH:usize = 10;
const HEIGHT:usize = 10;

static mut WORLD: Game = Game{
   player:Entity{
       pos: Pos{y:HEIGHT as u8/2,x:WIDTH as u8/2},
       value: b'@'
   },
   level: [b'.';HEIGHT*WIDTH]
};


//https://tung.github.io/posts/rust-and-webassembly-without-a-bundler/
#[no_mangle]
pub extern "C" fn add(left: usize, right: usize) -> usize {
    left + right
}
#[no_mangle]                    //TODO use a single u8
pub unsafe extern "C" fn plyMove(l:u8,d:u8,u:u8,r:u8) -> u8{
    WORLD.player.pos.y += d;
    WORLD.player.pos.y -= u;
    WORLD.player.pos.x += r;
    WORLD.player.pos.x -= l;
    WORLD.player.pos.y
}

#[no_mangle]
pub unsafe extern "C" fn tick()->*const u8{
    WORLD.level[Game::get_index(&WORLD.player.pos)] = WORLD.player.value;
    WORLD.level.as_ptr()
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
    level: [u8; WIDTH*HEIGHT]
}

impl Game {
    fn get_index(p: &Pos)-> usize{
        return (p.y * WIDTH as u8 + p.x) as usize;
    }
}

#[derive(Copy,Clone,Debug)]
pub struct Pos {
    y:u8,
    x:u8
}

pub struct Entity {
    pos: Pos,
    value: u8
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
