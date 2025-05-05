import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    position: 'relative',
  },
  backgroundShapes: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  title: {
    fontSize: 21,
    fontWeight: '700',
    color: '#202020',
    fontFamily: 'Raleway',
    textAlign: 'center',
    marginTop: 250,
  },
  subtitle: {
    fontSize: 19,
    fontWeight: '300',
    color: 'black',
    fontFamily: 'Nunito Sans',
    textAlign: 'center',
    marginTop: 30,
  },
  input: {
    backgroundColor: '#F1F1F1',
    borderRadius: 59.12,
    height: 52.22,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 13.79,
    fontFamily: 'Poppins',
    marginTop: 50,
  },
  nextButton: {
    backgroundColor: '#323660',
    borderRadius: 16,
    height: 61,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  nextButtonText: {
    color: '#F3F3F3',
    fontSize: 22,
    fontFamily: 'Nunito Sans',
    fontWeight: '300',
  },
  logoutText: {
    opacity: 0.90,
    color: '#202020',
    fontSize: 20,
    fontFamily: 'Nunito Sans',
    fontWeight: '300',
    textAlign: 'center',
    position: 'absolute',
    bottom: -100,
    left: 110,
  },
  divider: {
    width: 36,
    height: 1,
    position: 'absolute',
    top: 735,
    left: 172,
    backgroundColor: '#202020',
  },
});

export default styles;
