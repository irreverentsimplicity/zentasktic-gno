import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
    Button,
    Text,
  } from "@chakra-ui/react";
  import AssessTabBar from "./AssessTabBar";
  import DecideSliderContent from "./DecideSliderContent";
  import DoSliderContent from "./DoSliderContent";
  
  const SlidingDrawer = ({ isOpen, onClose, title, content }) => {
    // Determine the color based on the title
    const getTitleColor = () => {
      switch (title) {
        case 'Assess':
          return '#FF0000';
        case 'Decide':
          return '#FFA500';
        case 'Do':
          return '#008000';
        default:
          return 'black';
      }
    };
  
    return (
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xl">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader pb={0}>
            <Text fontSize="2xl" fontWeight="bold" color={getTitleColor()}>
              {title}
            </Text>
          </DrawerHeader>
  
          <DrawerBody>
            {title === 'Assess' ? <AssessTabBar /> : 
             title === 'Decide' ? <DecideSliderContent /> : 
             title === "Do" ? <DoSliderContent /> : 
             <p>{content}</p>}
          </DrawerBody>
  
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  };
  
  export default SlidingDrawer;
  