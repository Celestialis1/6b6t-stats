echo -e "\033]0;6b6t Stat Viewer | Vanguard\007"
clear
echo "Setting application title and running installer..."
cd "$(dirname "$0") || exit 1"
node installer.js && echo "Installer finished successfully."
read -p "Press Enter to exit..." 
