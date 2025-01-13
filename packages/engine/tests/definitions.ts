export type Company = {
  id: string // uuid
  name: string
}

export type Event = {
  id: string // uuid
  name: string
  p_uuid: string
  c_uuid: string
  place?: Place
  company?: Company
}
export type Person = {
  id: string // uuid
  name: string
}
export type Participate = {
  event_id: string // uuid
  person_id: string // uuid
}
export type Room = {
  r_uuid: string // uuid
  name: string
  p_uuid: string // place
}
export type Place = {
  p_uuid: string // uuid
  name: string
  point: string
}
export type Session = {
  s_uuid: string // uuid
  name: string
  event_uuid: string
  speaker_uuid: string
  room_uuid: string
  begin: string
  end: string
  event?: Event
  person?: Person
  room?: Room
}
export type LocoKitEngineTestType = Event | Person | Participate | Room | Place | Session
